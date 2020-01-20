<template>
    <div class="section">
        <div class="section-title">

            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <el-link @click="$router.back()" :underline="false" icon="el-icon-back">返回</el-link>
                </el-breadcrumb-item>
                <el-breadcrumb-item><span>点位训练</span></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="section-body">
            <el-form class="train-form" :inline="true" size="small">
                <el-form-item label="">
                    <el-select v-model="pointArea" placeholder="请选择点位" @change="handleInput">
                        <el-option label="书写区" value="书写区"></el-option>
                        <el-option label="左外延" value="左外延"></el-option>
                        <el-option label="左上外延" value="左上外延"></el-option>
                        <el-option label="左下外延" value="左下外延"></el-option>
                        <el-option label="上外延" value="上外延"></el-option>
                        <el-option label="下外延" value="下外延"></el-option>
                        <el-option label="右外延" value="右外延"></el-option>
                        <el-option label="右上外延" value="右上外延"></el-option>
                        <el-option label="右下外延" value="右下外延"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请输入点位：">
                    <el-form-item>
                        <el-input v-model="point.x" type="number" :min="0" :max="10" placeholder="x轴点位" @input="handleInput"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="point.y" type="number" :min="0" :max="10" placeholder="y轴点位" @input="handleInput"></el-input>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="当前点位：">
                    {{clickPoint.name}} : ({{clickPoint.point.toString()}})
                </el-form-item>
            </el-form>
            <div class="is-center">
                <div class="point-train">
                    <div class="point-box" id="point-box">
                        <div class="point-row" v-for="(row, rindex) in points" :key="rindex">
                        <span v-for="(column, cindex) in row" :key="cindex" class="dot" :class="{'active': column.show}"
                              @click="handlePointClick(column, rindex, cindex)"></span>
                        </div>

                        <el-image :src="pen" class="pen" :style="styles"></el-image>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
  export default {
    name: "PointTrain",
    data() {
      return {
        pen: require('@/assets/img/pen.png'),
        points: [
          [
            {name: '左上外延', point: [3, 3]},
            {name: '左上外延', point: [2, 3]},
            {name: '左上外延', point: [1, 3]},
            {name: '上外延', point: [0, 3]},
            {name: '上外延', point: [1, 3]},
            {name: '上外延', point: [2, 3]},
            {name: '上外延', point: [3, 3]},
            {name: '上外延', point: [6, 3]},
            {name: '上外延', point: [5, 3]},
            {name: '上外延', point: [6, 3]},
            {name: '上外延', point: [7, 3]},
            {name: '上外延', point: [8, 3]},
            {name: '上外延', point: [9, 3]},
            {name: '上外延', point: [10, 3]},
            {name: '右上外延', point: [1, 3]},
            {name: '右上外延', point: [2, 3]},
            {name: '右上外延', point: [3, 3]}
          ],
          [
            {name: '左上外延', point: [3, 2]},
            {name: '左上外延', point: [2, 2]},
            {name: '左上外延', point: [1, 2]},
            {name: '上外延', point: [0, 2]},
            {name: '上外延', point: [1, 2]},
            {name: '上外延', point: [2, 2]},
            {name: '上外延', point: [3, 2]},
            {name: '上外延', point: [6, 2]},
            {name: '上外延', point: [5, 2]},
            {name: '上外延', point: [6, 2]},
            {name: '上外延', point: [7, 2]},
            {name: '上外延', point: [8, 2]},
            {name: '上外延', point: [9, 2]},
            {name: '上外延', point: [10, 2]},
            {name: '右上外延', point: [1, 2]},
            {name: '右上外延', point: [2, 2]},
            {name: '右上外延', point: [3, 2]}
          ],
          [
            {name: '左上外延', point: [3, 1]},
            {name: '左上外延', point: [2, 1]},
            {name: '左上外延', point: [1, 1]},
            {name: '上外延', point: [0, 1]},
            {name: '上外延', point: [1, 1]},
            {name: '上外延', point: [2, 1]},
            {name: '上外延', point: [3, 1]},
            {name: '上外延', point: [4, 1]},
            {name: '上外延', point: [5, 1]},
            {name: '上外延', point: [6, 1]},
            {name: '上外延', point: [7, 1]},
            {name: '上外延', point: [8, 1]},
            {name: '上外延', point: [9, 1]},
            {name: '上外延', point: [10, 1]},
            {name: '右上外延', point: [1, 1]},
            {name: '右上外延', point: [2, 1]},
            {name: '右上外延', point: [3, 1]}
          ],
          [
            {name: '左外延', point: [3, 0]},
            {name: '左外延', point: [2, 0]},
            {name: '左外延', point: [1, 0]},
            {name: '书写区', point: [0, 0], show: true},
            {name: '书写区', point: [1, 0]},
            {name: '书写区', point: [2, 0]},
            {name: '书写区', point: [3, 0]},
            {name: '书写区', point: [4, 0]},
            {name: '书写区', point: [5, 0]},
            {name: '书写区', point: [6, 0]},
            {name: '书写区', point: [7, 0]},
            {name: '书写区', point: [8, 0]},
            {name: '书写区', point: [9, 0]},
            {name: '书写区', point: [10, 0], show: true},
            {name: '右外延', point: [1, 0]},
            {name: '右外延', point: [2, 0]},
            {name: '右外延', point: [3, 0]}
          ],
          [
            {name: '左外延', point: [3, 1]},
            {name: '左外延', point: [2, 1]},
            {name: '左外延', point: [1, 1]},
            {name: '书写区', point: [0, 1]},
            {name: '书写区', point: [1, 1]},
            {name: '书写区', point: [2, 1]},
            {name: '书写区', point: [3, 1]},
            {name: '书写区', point: [4, 1]},
            {name: '书写区', point: [5, 1]},
            {name: '书写区', point: [6, 1]},
            {name: '书写区', point: [7, 1]},
            {name: '书写区', point: [8, 1]},
            {name: '书写区', point: [9, 1]},
            {name: '书写区', point: [10, 1]},
            {name: '右外延', point: [1, 1]},
            {name: '右外延', point: [2, 1]},
            {name: '右外延', point: [3, 1]}
          ],
          [
            {name: '左外延', point: [3, 2]},
            {name: '左外延', point: [2, 2]},
            {name: '左外延', point: [1, 2]},
            {name: '书写区', point: [0, 2]},
            {name: '书写区', point: [1, 2]},
            {name: '书写区', point: [2, 2]},
            {name: '书写区', point: [3, 2]},
            {name: '书写区', point: [4, 2]},
            {name: '书写区', point: [5, 2]},
            {name: '书写区', point: [6, 2]},
            {name: '书写区', point: [7, 2]},
            {name: '书写区', point: [8, 2]},
            {name: '书写区', point: [9, 2]},
            {name: '书写区', point: [10, 2]},
            {name: '右外延', point: [1, 2]},
            {name: '右外延', point: [2, 2]},
            {name: '右外延', point: [3, 2]}
          ],
          [
            {name: '左外延', point: [3, 3]},
            {name: '左外延', point: [2, 3]},
            {name: '左外延', point: [1, 3]},
            {name: '书写区', point: [0, 3]},
            {name: '书写区', point: [1, 3]},
            {name: '书写区', point: [2, 3]},
            {name: '书写区', point: [3, 3]},
            {name: '书写区', point: [4, 3]},
            {name: '书写区', point: [5, 3]},
            {name: '书写区', point: [6, 3]},
            {name: '书写区', point: [7, 3]},
            {name: '书写区', point: [8, 3]},
            {name: '书写区', point: [9, 3]},
            {name: '书写区', point: [10, 3]},
            {name: '右外延', point: [1, 3]},
            {name: '右外延', point: [2, 3]},
            {name: '右外延', point: [3, 3]}
          ],
          [
            {name: '左外延', point: [3, 4]},
            {name: '左外延', point: [2, 4]},
            {name: '左外延', point: [1, 4]},
            {name: '书写区', point: [0, 4]},
            {name: '书写区', point: [1, 4]},
            {name: '书写区', point: [2, 4]},
            {name: '书写区', point: [3, 4]},
            {name: '书写区', point: [4, 4]},
            {name: '书写区', point: [5, 4]},
            {name: '书写区', point: [6, 4]},
            {name: '书写区', point: [7, 4]},
            {name: '书写区', point: [8, 4]},
            {name: '书写区', point: [9, 4]},
            {name: '书写区', point: [10, 4]},
            {name: '右外延', point: [1, 4]},
            {name: '右外延', point: [2, 4]},
            {name: '右外延', point: [3, 4]}
          ],
          [
            {name: '左外延', point: [3, 5]},
            {name: '左外延', point: [2, 5]},
            {name: '左外延', point: [1, 5]},
            {name: '书写区', point: [0, 5]},
            {name: '书写区', point: [1, 5]},
            {name: '书写区', point: [2, 5]},
            {name: '书写区', point: [3, 5]},
            {name: '书写区', point: [4, 5]},
            {name: '书写区', point: [5, 5], show: true},
            {name: '书写区', point: [6, 5]},
            {name: '书写区', point: [7, 5]},
            {name: '书写区', point: [8, 5]},
            {name: '书写区', point: [9, 5]},
            {name: '书写区', point: [10, 5]},
            {name: '右外延', point: [1, 5]},
            {name: '右外延', point: [2, 5]},
            {name: '右外延', point: [3, 5]}
          ],
          [
            {name: '左外延', point: [3, 6]},
            {name: '左外延', point: [2, 6]},
            {name: '左外延', point: [1, 6]},
            {name: '书写区', point: [0, 6]},
            {name: '书写区', point: [1, 6]},
            {name: '书写区', point: [2, 6]},
            {name: '书写区', point: [3, 6]},
            {name: '书写区', point: [4, 6]},
            {name: '书写区', point: [5, 6]},
            {name: '书写区', point: [6, 6]},
            {name: '书写区', point: [7, 6]},
            {name: '书写区', point: [8, 6]},
            {name: '书写区', point: [9, 6]},
            {name: '书写区', point: [10, 6]},
            {name: '右外延', point: [1, 6]},
            {name: '右外延', point: [2, 6]},
            {name: '右外延', point: [3, 6]}
          ],
          [
            {name: '左外延', point: [3, 7]},
            {name: '左外延', point: [2, 7]},
            {name: '左外延', point: [1, 7]},
            {name: '书写区', point: [0, 7]},
            {name: '书写区', point: [1, 7]},
            {name: '书写区', point: [2, 7]},
            {name: '书写区', point: [3, 7]},
            {name: '书写区', point: [4, 7]},
            {name: '书写区', point: [5, 7]},
            {name: '书写区', point: [6, 7]},
            {name: '书写区', point: [7, 7]},
            {name: '书写区', point: [8, 7]},
            {name: '书写区', point: [9, 7]},
            {name: '书写区', point: [10, 7]},
            {name: '右外延', point: [1, 7]},
            {name: '右外延', point: [2, 7]},
            {name: '右外延', point: [3, 7]}
          ],
          [
            {name: '左外延', point: [3, 8]},
            {name: '左外延', point: [2, 8]},
            {name: '左外延', point: [1, 8]},
            {name: '书写区', point: [0, 8]},
            {name: '书写区', point: [1, 8]},
            {name: '书写区', point: [2, 8]},
            {name: '书写区', point: [3, 8]},
            {name: '书写区', point: [4, 8]},
            {name: '书写区', point: [5, 8]},
            {name: '书写区', point: [6, 8]},
            {name: '书写区', point: [7, 8]},
            {name: '书写区', point: [8, 8]},
            {name: '书写区', point: [9, 8]},
            {name: '书写区', point: [10, 8]},
            {name: '右外延', point: [1, 8]},
            {name: '右外延', point: [2, 8]},
            {name: '右外延', point: [3, 8]}
          ],
          [
            {name: '左外延', point: [3, 9]},
            {name: '左外延', point: [2, 9]},
            {name: '左外延', point: [1, 9]},
            {name: '书写区', point: [0, 9]},
            {name: '书写区', point: [1, 9]},
            {name: '书写区', point: [2, 9]},
            {name: '书写区', point: [3, 9]},
            {name: '书写区', point: [4, 9]},
            {name: '书写区', point: [5, 9]},
            {name: '书写区', point: [6, 9]},
            {name: '书写区', point: [7, 9]},
            {name: '书写区', point: [8, 9]},
            {name: '书写区', point: [9, 9]},
            {name: '书写区', point: [10, 9]},
            {name: '右外延', point: [1, 9]},
            {name: '右外延', point: [2, 9]},
            {name: '右外延', point: [3, 9]}
          ],
          [
            {name: '左外延', point: [3, 10]},
            {name: '左外延', point: [2, 10]},
            {name: '左外延', point: [1, 10]},
            {name: '书写区', point: [0, 10], show: true},
            {name: '书写区', point: [1, 10]},
            {name: '书写区', point: [2, 10]},
            {name: '书写区', point: [3, 10]},
            {name: '书写区', point: [4, 10]},
            {name: '书写区', point: [5, 10]},
            {name: '书写区', point: [6, 10]},
            {name: '书写区', point: [7, 10]},
            {name: '书写区', point: [8, 10]},
            {name: '书写区', point: [9, 10]},
            {name: '书写区', point: [10, 10], show: true},
            {name: '右外延', point: [1, 10]},
            {name: '右外延', point: [2, 10]},
            {name: '右外延', point: [3, 10]}
          ],
          [
            {name: '左下外延', point: [3, 1]},
            {name: '左下外延', point: [2, 1]},
            {name: '左下外延', point: [1, 1]},
            {name: '下外延', point: [0, 1]},
            {name: '下外延', point: [1, 1]},
            {name: '下外延', point: [2, 1]},
            {name: '下外延', point: [3, 1]},
            {name: '下外延', point: [4, 1]},
            {name: '下外延', point: [5, 1]},
            {name: '下外延', point: [6, 1]},
            {name: '下外延', point: [7, 1]},
            {name: '下外延', point: [8, 1]},
            {name: '下外延', point: [9, 1]},
            {name: '下外延', point: [10, 1]},
            {name: '右下外延', point: [1, 1]},
            {name: '右下外延', point: [2, 1]},
            {name: '右下外延', point: [3, 1]}
          ],
          [
            {name: '左下外延', point: [3, 2]},
            {name: '左下外延', point: [2, 2]},
            {name: '左下外延', point: [1, 2]},
            {name: '下外延', point: [0, 2]},
            {name: '下外延', point: [1, 2]},
            {name: '下外延', point: [2, 2]},
            {name: '下外延', point: [3, 2]},
            {name: '下外延', point: [6, 2]},
            {name: '下外延', point: [5, 2]},
            {name: '下外延', point: [6, 2]},
            {name: '下外延', point: [7, 2]},
            {name: '下外延', point: [8, 2]},
            {name: '下外延', point: [9, 2]},
            {name: '下外延', point: [10, 2]},
            {name: '右下外延', point: [1, 2]},
            {name: '右下外延', point: [2, 2]},
            {name: '右下外延', point: [3, 2]}
          ],
          [
            {name: '左上外延', point: [3, 3]},
            {name: '左上外延', point: [2, 3]},
            {name: '左上外延', point: [1, 3]},
            {name: '上外延', point: [0, 3]},
            {name: '上外延', point: [1, 3]},
            {name: '上外延', point: [2, 3]},
            {name: '上外延', point: [3, 3]},
            {name: '上外延', point: [6, 3]},
            {name: '上外延', point: [5, 3]},
            {name: '上外延', point: [6, 3]},
            {name: '上外延', point: [7, 3]},
            {name: '上外延', point: [8, 3]},
            {name: '上外延', point: [9, 3]},
            {name: '上外延', point: [10, 3]},
            {name: '右上外延', point: [1, 3]},
            {name: '右上外延', point: [2, 3]},
            {name: '右上外延', point: [3, 3]}
          ]
        ],
        pointArea: '',
        clickPoint: {
          name: '书写区',
          point: [0, 0]
        },
        styles: {},
        point: {x: '', y: ''}
      }
    },
    created() {
      this.handlePointClick({name: '书写区', point: [0, 0]}, 3, 3);
    },
    methods: {
      handlePointClick(column, rindex, cindex) {
        this.clickPoint = column

        this.styles = {
          left: (cindex + 0.3) * 16 + 'px',
          top: (rindex + 0.3) * 16 + 'px'
        }
      },
      handleInput() {
        if (this.point.x !== '' && this.point.y !== '') {
          let flag = false
          let point = [parseInt(this.point.x), parseInt(this.point.y)]
          let isBreak = false;
          for (let i = 0, rows = this.points.length; i < rows; i++) {
            let row = this.points[i];
            for (let j = 0, columns = row.length; j < columns; j++) {
              let column = row[j];
              if (column.point[0] === point[0] && column.point[1] === point[1] && this.pointArea === column.name) {
                this.handlePointClick(column, i, j);
                isBreak = true
                flag = true
                break;
              }
            }
            if (isBreak) {
              break;
            }
          }

          if (!flag) {
            this.$message.error('请输入正确的点位坐标')
          }
        }
      },
      goBack() {
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="scss">
    .section-title {
        .el-breadcrumb span {
            color: #939393;
        }
    }
    .point-train {
        position: relative;
        border: 2px solid #ff0000;
        display: inline-block;
        margin: 15px auto;
        background-color: rgba(254, 53, 6, 0.1);

        .point-box {
            width: 272px;
            height: 272px;
            position: relative;

            .point-row:after {
                content: '';
                display: block;
                clear: both;
            }

            .dot {
                display: inline-block;
                width: 16px;
                height: 16px;
                position: relative;
                float: left;

                &.active:before {
                    content: '';
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background-color: #ff0000;
                    display: inline-block;
                }
            }

            .pen {
                position: absolute;
                width: 30px;
                height: 30px;
                transition: all 0.3s;
            }
        }
    }

    .el-form{
        .el-form-item{
            margin: 0 0 5px;
        }
        .el-select{
            width: 180px;
        }
    }
</style>
